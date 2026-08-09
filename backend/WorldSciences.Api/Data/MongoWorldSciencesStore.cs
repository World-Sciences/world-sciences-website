using System.Text.RegularExpressions;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using WorldSciences.Api.Configuration;
using WorldSciences.Api.Models;

namespace WorldSciences.Api.Data;

public sealed class MongoWorldSciencesStore : IWorldSciencesStore
{
    private readonly IMongoCollection<Article> _articles;
    private readonly IMongoCollection<Author> _authors;
    private readonly IMongoCollection<Topic> _topics;

    public MongoWorldSciencesStore(IOptions<MongoSettings> options)
    {
        var settings = options.Value;
        var db = new MongoClient(settings.ConnectionString).GetDatabase(settings.DatabaseName);
        _articles = db.GetCollection<Article>("articles");
        _authors = db.GetCollection<Author>("authors");
        _topics = db.GetCollection<Topic>("topics");
    }

    public async Task<IReadOnlyList<Article>> GetArticlesAsync() =>
        await _articles.Find(FilterDefinition<Article>.Empty)
            .SortByDescending(a => a.PublishedAt).ToListAsync();

    public async Task<Article?> GetArticleBySlugAsync(string slug) =>
        await _articles.Find(SlugEquals<Article>(a => a.Slug, slug)).FirstOrDefaultAsync();

    public async Task<IReadOnlyList<Author>> GetAuthorsAsync() =>
        await _authors.Find(FilterDefinition<Author>.Empty).ToListAsync();

    public async Task<Author?> GetAuthorBySlugAsync(string slug) =>
        await _authors.Find(SlugEquals<Author>(a => a.Slug, slug)).FirstOrDefaultAsync();

    public async Task<Author?> GetAuthorByIdAsync(int id) =>
        await _authors.Find(a => a.Id == id).FirstOrDefaultAsync();

    public async Task<IReadOnlyList<Topic>> GetTopicsAsync() =>
        await _topics.Find(FilterDefinition<Topic>.Empty).SortBy(t => t.Name).ToListAsync();

    private static FilterDefinition<T> SlugEquals<T>(
        System.Linq.Expressions.Expression<Func<T, object>> field, string slug) =>
        Builders<T>.Filter.Regex(
            field, new BsonRegularExpression($"^{Regex.Escape(slug)}$", "i"));
}
