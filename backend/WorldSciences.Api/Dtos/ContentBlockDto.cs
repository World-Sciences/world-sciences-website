namespace WorldSciences.Api.Dtos;

public sealed record ContentBlockDto(
    string Type,
    string? Text,
    string? Src,
    string? Alt,
    string? Caption,
    int SortOrder);
