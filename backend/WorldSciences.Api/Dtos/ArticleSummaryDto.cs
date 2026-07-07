namespace WorldSciences.Api.Dtos;

public sealed record ArticleSummaryDto(
    int Id,
    string Slug,
    string Title,
    string Excerpt,
    IReadOnlyList<string> Topics,
    AuthorDto Author,
    DateOnly PublishedAt,
    string ReadTime,
    string ImageUrl);
