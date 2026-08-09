namespace WorldSciences.Api.Configuration;

public sealed class MongoSettings
{
    public string ConnectionString { get; set; } = "mongodb://localhost:27017";
    public string DatabaseName { get; set; } = "worldsciences";
}
