using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using MongoDB.Driver;
using WorldSciences.Api.Data;
using WorldSciences.Api.Models;
using Xunit;

public class ArticlesEndpointTests : IClassFixture<WebApplicationFactory<Program>>, IAsyncLifetime
{
    private const string ConnStr = "mongodb://localhost:27017";
    private const string DbName = "worldsciences_test";
    private readonly WebApplicationFactory<Program> _factory;
    private readonly IMongoClient _client = new MongoClient(ConnStr);

    public ArticlesEndpointTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(b => b.UseSetting("Mongo:ConnectionString", ConnStr)
                                                    .UseSetting("Mongo:DatabaseName", DbName));
    }

    public async Task InitializeAsync()
    {
        MongoConfiguration.Register();
        await _client.DropDatabaseAsync(DbName);
        var db = _client.GetDatabase(DbName);
        await db.GetCollection<Author>("authors").InsertOneAsync(
            new Author(1, "Tejas B.", "tejas-b", null, "bio"));
        await db.GetCollection<Article>("articles").InsertOneAsync(
            new Article(1, "the-slug", "The Title", "Excerpt", 1, new DateOnly(2026, 6, 11),
                "6 min read", "http://img", new[] { "Israel" },
                new[] { new ArticleContentBlock(1, "paragraph", Text: "Body") }));
    }

    public async Task DisposeAsync() => await _client.DropDatabaseAsync(DbName);

    [Fact]
    public async Task Get_articles_returns_summary_with_author()
    {
        var client = _factory.CreateClient();
        var res = await client.GetAsync("/api/articles");
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var body = await res.Content.ReadFromJsonAsync<List<JsonSummary>>();
        Assert.Single(body!);
        Assert.Equal("the-slug", body![0].Slug);
        Assert.Equal("Tejas B.", body[0].Author.Name);
    }

    [Fact]
    public async Task Get_article_by_slug_returns_detail_with_content_blocks()
    {
        var client = _factory.CreateClient();
        var res = await client.GetAsync("/api/articles/the-slug");
        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var body = await res.Content.ReadFromJsonAsync<JsonDetail>();
        Assert.Equal("The Title", body!.Title);
        Assert.Single(body.ContentBlocks);
        Assert.Equal("Body", body.ContentBlocks[0].Text);
    }

    [Fact]
    public async Task Get_unknown_slug_returns_404()
    {
        var client = _factory.CreateClient();
        var res = await client.GetAsync("/api/articles/does-not-exist");
        Assert.Equal(HttpStatusCode.NotFound, res.StatusCode);
    }

    [Fact]
    public async Task Get_articles_skips_article_with_missing_author()
    {
        var db = _client.GetDatabase(DbName);
        await db.GetCollection<Article>("articles").InsertOneAsync(
            new Article(2, "orphan-slug", "Orphan", "Excerpt", 99, new DateOnly(2026, 7, 1),
                "3 min read", "http://img", new[] { "Israel" },
                new[] { new ArticleContentBlock(1, "paragraph", Text: "Body") }));

        var client = _factory.CreateClient();
        var res = await client.GetAsync("/api/articles");

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);
        var body = await res.Content.ReadFromJsonAsync<List<JsonSummary>>();
        Assert.Single(body!);                       // orphan excluded; only the valid article remains
        Assert.Equal("the-slug", body![0].Slug);
    }

    [Fact]
    public async Task Get_article_by_slug_with_missing_author_returns_404()
    {
        var db = _client.GetDatabase(DbName);
        await db.GetCollection<Article>("articles").InsertOneAsync(
            new Article(2, "orphan-slug", "Orphan", "Excerpt", 99, new DateOnly(2026, 7, 1),
                "3 min read", "http://img", new[] { "Israel" },
                new[] { new ArticleContentBlock(1, "paragraph", Text: "Body") }));

        var client = _factory.CreateClient();
        var res = await client.GetAsync("/api/articles/orphan-slug");

        Assert.Equal(HttpStatusCode.NotFound, res.StatusCode);
    }

    private record JsonAuthor(string Name);
    private record JsonSummary(string Slug, JsonAuthor Author);
    private record JsonBlock(string Text);
    private record JsonDetail(string Title, List<JsonBlock> ContentBlocks);
}
