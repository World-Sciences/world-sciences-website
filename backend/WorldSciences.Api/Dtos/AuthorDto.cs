namespace WorldSciences.Api.Dtos;

public sealed record AuthorDto(
    int Id,
    string Name,
    string Slug,
    string? AvatarUrl,
    string Bio);
