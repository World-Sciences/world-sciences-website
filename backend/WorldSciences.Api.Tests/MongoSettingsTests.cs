using Microsoft.Extensions.Configuration;
using WorldSciences.Api.Configuration;
using Xunit;

public class MongoSettingsTests
{
    [Fact]
    public void Binds_connection_string_and_database_name_from_Mongo_section()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Mongo:ConnectionString"] = "mongodb://localhost:27017",
                ["Mongo:DatabaseName"] = "worldsciences",
            })
            .Build();

        var settings = config.GetSection("Mongo").Get<MongoSettings>();

        Assert.NotNull(settings);
        Assert.Equal("mongodb://localhost:27017", settings!.ConnectionString);
        Assert.Equal("worldsciences", settings.DatabaseName);
    }
}
