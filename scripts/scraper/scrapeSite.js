import { discoverArticleUrls } from "./discoverArticleUrls.js";
import { exportSeedData } from "./exportSeedData.js";
import { scrapeArticle } from "./scrapeArticle.js";

const DEFAULT_BASE_URL = "https://www.worldsciences.info";

function parseArgs(argv) {
  const options = {
    baseUrl: DEFAULT_BASE_URL,
    outputDir: "seed",
    dryRun: false,
    limit: null,
  };

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];

    if (arg === "--base-url") {
      options.baseUrl = argv[++index];
    } else if (arg === "--output-dir") {
      options.outputDir = argv[++index];
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--limit") {
      options.limit = Number(argv[++index]);
    }
  }

  return options;
}

export async function runScraper(options) {
  console.log(`Discovering articles from ${options.baseUrl}...`);

  const discoveredArticles = await discoverArticleUrls({ baseUrl: options.baseUrl });
  const articleEntries = options.limit
    ? discoveredArticles.slice(0, options.limit)
    : discoveredArticles;
  const scrapedArticles = [];

  console.log(`Found ${discoveredArticles.length} article URLs.`);

  for (const [index, entry] of articleEntries.entries()) {
    console.log(`[${index + 1}/${articleEntries.length}] Scraping ${entry.url}`);
    scrapedArticles.push(await scrapeArticle(entry, { baseUrl: options.baseUrl }));
  }

  const result = await exportSeedData(scrapedArticles, {
    outputDir: options.outputDir,
    dryRun: options.dryRun,
  });

  const warnings = result.report.articles.flatMap((article) =>
    article.warnings.map((warning) => `${article.slug}: ${warning}`)
  );

  console.log("");
  console.log(`Articles: ${result.articles.length}`);
  console.log(`Authors: ${result.authors.length}`);
  console.log(`Topics: ${result.topics.length}`);
  console.log(`Warnings: ${warnings.length}`);

  if (warnings.length) {
    warnings.forEach((warning) => console.log(`- ${warning}`));
  }

  if (!options.dryRun) {
    console.log(`Seed data written to ${options.outputDir}/`);
    console.log(`Review ${options.outputDir}/scrape-report.json before reseeding MongoDB.`);
  }
}

const options = parseArgs(process.argv.slice(2));

runScraper(options).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
