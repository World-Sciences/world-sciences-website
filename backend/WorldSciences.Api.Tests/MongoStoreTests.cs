using Microsoft.Extensions.Options;
using MongoDB.Driver;
using WorldSciences.Api.Configuration;
using WorldSciences.Api.Data;
using WorldSciences.Api.Models;
using Xunit;

public class MongoStoreTests : IAsyncLifetime
{
    private const string ConnStr = "mongodb://localhost:27017";
    private const string DbName = "worldsciences_test_store";
    private readonly IMongoClient _client = new MongoClient(ConnStr);
    private MongoWorldSciencesStore _store = null!;

    public async Task InitializeAsync()
    {
        MongoConfiguration.Register();
        await _client.DropDatabaseAsync(DbName);
        var db = _client.GetDatabase(DbName);

        await db.GetCollection<Author>("authors").InsertManyAsync(new[]
        {
            new Author(1, "Tejas B.", "tejas-b", null, "bio"),
            new Author(2, "Shiv R.", "shiv-r", null, "bio"),
        });
        await db.GetCollection<Topic>("topics").InsertManyAsync(new[]
        {
            new Topic(2, "Iran", "iran"),
            new Topic(1, "Geopolitical Strategy", "geopolitical-strategy"),
        });
        await db.GetCollection<Article>("articles").InsertManyAsync(new[]
        {
            new Article(1, "older", "Older", "e", 1, new DateOnly(2026, 1, 1), "5 min read", "u",
                new[] { "Iran" }, new[] { new ArticleContentBlock(1, "paragraph", Text: "a") }),
            new Article(2, "newer", "Newer", "e", 2, new DateOnly(2026, 6, 1), "5 min read", "u",
                new[] { "Israel" }, new[] { new ArticleContentBlock(1, "paragraph", Text: "b") }),
        });

        _store = new MongoWorldSciencesStore(Options.Create(
            new MongoSettings { ConnectionString = ConnStr, DatabaseName = DbName }));
    }

    public async Task DisposeAsync() => await _client.DropDatabaseAsync(DbName);

    [Fact]
    public async Task GetArticlesAsync_returns_newest_first()
    {
        var articles = await _store.GetArticlesAsync();
        Assert.Equal(new[] { "newer", "older" }, articles.Select(a => a.Slug));
    }

    [Fact]
    public async Task GetArticleBySlugAsync_is_case_insensitive()
    {
        var article = await _store.GetArticleBySlugAsync("NEWER");
        Assert.NotNull(article);
        Assert.Equal(2, article!.Id);
    }

    [Fact]
    public async Task GetTopicsAsync_returns_ordered_by_name()
    {
        var topics = await _store.GetTopicsAsync();
        Assert.Equal(new[] { "Geopolitical Strategy", "Iran" }, topics.Select(t => t.Name));
    }

    [Fact]
    public async Task GetAuthorBySlugAsync_and_ById_resolve()
    {
        Assert.Equal(1, (await _store.GetAuthorBySlugAsync("tejas-b"))!.Id);
        Assert.Equal("Shiv R.", (await _store.GetAuthorByIdAsync(2))!.Name);
    }
}
