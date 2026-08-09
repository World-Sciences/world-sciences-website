using WorldSciences.Api.Models;

namespace WorldSciences.Api.Data;

public interface IWorldSciencesStore
{
    Task<IReadOnlyList<Article>> GetArticlesAsync();            // ordered by PublishedAt desc
    Task<Article?> GetArticleBySlugAsync(string slug);         // case-insensitive
    Task<IReadOnlyList<Author>> GetAuthorsAsync();
    Task<Author?> GetAuthorBySlugAsync(string slug);           // case-insensitive
    Task<Author?> GetAuthorByIdAsync(int id);
    Task<IReadOnlyList<Topic>> GetTopicsAsync();               // ordered by Name
}
