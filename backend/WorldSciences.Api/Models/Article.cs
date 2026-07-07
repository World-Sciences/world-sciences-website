namespace WorldSciences.Api.Models;

public sealed record Article(
    int Id,
    string Slug,
    string Title,
    string Excerpt,
    int AuthorId,
    DateOnly PublishedAt,
    string ReadTime,
    string ImageUrl,
    IReadOnlyList<string> Topics,
    IReadOnlyList<ArticleContentBlock> ContentBlocks);
