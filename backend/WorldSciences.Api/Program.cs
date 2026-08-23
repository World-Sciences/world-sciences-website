using WorldSciences.Api.Configuration;
using WorldSciences.Api.Data;
using WorldSciences.Api.Dtos;
using WorldSciences.Api.Models;

var builder = WebApplication.CreateBuilder(args);

MongoConfiguration.Register();
builder.Services.Configure<MongoSettings>(builder.Configuration.GetSection("Mongo"));
builder.Services.AddSingleton<IWorldSciencesStore, MongoWorldSciencesStore>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("Frontend");

var api = app.MapGroup("/api");

api.MapGet("/health", () => Results.Ok(new { status = "ok" }));

api.MapGet("/articles", async (IWorldSciencesStore store) =>
{
    var authors = (await store.GetAuthorsAsync()).ToDictionary(author => author.Id);
    var articles = await store.GetArticlesAsync();

    return articles
        .Where(article => authors.ContainsKey(article.AuthorId))
        .Select(article => ToSummaryDto(article, authors[article.AuthorId]));
});

api.MapGet("/articles/{slug}", async (string slug, IWorldSciencesStore store) =>
{
    var article = await store.GetArticleBySlugAsync(slug);

    if (article is null)
    {
        return Results.NotFound();
    }

    var author = await store.GetAuthorByIdAsync(article.AuthorId);

    if (author is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(ToDetailDto(article, author));
});

api.MapGet("/authors", async (IWorldSciencesStore store) =>
    (await store.GetAuthorsAsync()).Select(ToAuthorDto));

api.MapGet("/authors/{slug}", async (string slug, IWorldSciencesStore store) =>
{
    var author = await store.GetAuthorBySlugAsync(slug);

    return author is null ? Results.NotFound() : Results.Ok(ToAuthorDto(author));
});

api.MapGet("/topics", async (IWorldSciencesStore store) => await store.GetTopicsAsync());

app.Run();

static ArticleSummaryDto ToSummaryDto(Article article, Author author)
{
    return new ArticleSummaryDto(
        article.Id,
        article.Slug,
        article.Title,
        article.Excerpt,
        article.Topics,
        new AuthorDto(author.Id, author.Name, author.Slug, author.AvatarUrl, author.Bio),
        article.PublishedAt,
        article.ReadTime,
        article.ImageUrl);
}

static ArticleDetailDto ToDetailDto(Article article, Author author)
{
    return new ArticleDetailDto(
        article.Id,
        article.Slug,
        article.Title,
        article.Excerpt,
        article.Topics,
        new AuthorDto(author.Id, author.Name, author.Slug, author.AvatarUrl, author.Bio),
        article.PublishedAt,
        article.ReadTime,
        article.ImageUrl,
        article.ContentBlocks
            .OrderBy(block => block.SortOrder)
            .Select(block => new ContentBlockDto(
                block.Type,
                block.Text,
                block.Src,
                block.Alt,
                block.Caption,
                block.SortOrder))
            .ToList());
}

static AuthorDto ToAuthorDto(Author author)
{
    return new AuthorDto(author.Id, author.Name, author.Slug, author.AvatarUrl, author.Bio);
}

// Exposes the implicit Program class so WebApplicationFactory<Program> can boot the app in tests.
public partial class Program { }
