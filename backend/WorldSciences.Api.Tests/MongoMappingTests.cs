using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using WorldSciences.Api.Data;
using WorldSciences.Api.Models;
using Xunit;

public class MongoMappingTests
{
    public MongoMappingTests() => MongoConfiguration.Register();

    [Fact]
    public void Article_round_trips_through_bson_with_camelCase_and_DateOnly()
    {
        var article = new Article(
            1, "slug-1", "Title", "Excerpt", 1,
            new DateOnly(2026, 6, 11), "6 min read", "http://img",
            new[] { "Israel", "Lebanon" },
            new[] { new ArticleContentBlock(1, "paragraph", Text: "Body") });

        var doc = article.ToBsonDocument();

        Assert.Equal("slug-1", doc["slug"].AsString);              // camelCase element name
        Assert.Equal("2026-06-11", doc["publishedAt"].AsString);   // DateOnly as ISO string

        doc["_id"] = ObjectId.GenerateNewId();                     // simulate mongoimport's _id
        var back = BsonSerializer.Deserialize<Article>(doc);       // must ignore extra _id

        Assert.Equal(article.Slug, back.Slug);
        Assert.Equal(article.PublishedAt, back.PublishedAt);
        Assert.Equal(article.Topics, back.Topics);
        Assert.Equal("Body", back.ContentBlocks[0].Text);
    }
}
