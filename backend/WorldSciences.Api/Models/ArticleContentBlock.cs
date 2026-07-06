namespace WorldSciences.Api.Models;

public sealed record ArticleContentBlock(
    int SortOrder,
    string Type,
    string? Text = null,
    string? Src = null,
    string? Alt = null,
    string? Caption = null);
