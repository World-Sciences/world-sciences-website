namespace WorldSciences.Api.Models;

public sealed record Author(
    int Id,
    string Name,
    string Slug,
    string? AvatarUrl,
    string Bio);
