using WorldSciences.Api.Data;
using WorldSciences.Api.Dtos;
using WorldSciences.Api.Models;

var builder = WebApplication.CreateBuilder(args);

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

api.MapGet("/articles", () =>
{
    var authors = WorldSciencesSeedData.Authors.ToDictionary(author => author.Id);

    return WorldSciencesSeedData.Articles
        .OrderByDescending(article => article.PublishedAt)
        .Select(article => ToSummaryDto(article, authors[article.AuthorId]));
});

api.MapGet("/articles/{slug}", (string slug) =>
{
    var article = WorldSciencesSeedData.Articles
        .FirstOrDefault(item => string.Equals(item.Slug, slug, StringComparison.OrdinalIgnoreCase));

    if (article is null)
    {
        return Results.NotFound();
    }

    var author = WorldSciencesSeedData.Authors.First(item => item.Id == article.AuthorId);

    return Results.Ok(ToDetailDto(article, author));
});

api.MapGet("/authors", () => WorldSciencesSeedData.Authors.Select(ToAuthorDto));

api.MapGet("/authors/{slug}", (string slug) =>
{
    var author = WorldSciencesSeedData.Authors
        .FirstOrDefault(item => string.Equals(item.Slug, slug, StringComparison.OrdinalIgnoreCase));

    return author is null ? Results.NotFound() : Results.Ok(ToAuthorDto(author));
});

api.MapGet("/topics", () => WorldSciencesSeedData.Topics.OrderBy(topic => topic.Name));

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
