using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;

namespace WorldSciences.Api.Data;

public static class MongoConfiguration
{
    private static bool _registered;
    private static readonly object Lock = new();

    public static void Register()
    {
        lock (Lock)
        {
            if (_registered) return;

            BsonSerializer.TryRegisterSerializer(new DateOnlySerializer());

            ConventionRegistry.Register(
                "worldsciences",
                new ConventionPack
                {
                    new CamelCaseElementNameConvention(),
                    new IgnoreExtraElementsConvention(true),
                    // Our integer `Id` is a normal field, not the document `_id`.
                    // mongoimport assigns its own ObjectId `_id`; keep them separate.
                    new NoIdMemberConvention(),
                },
                _ => true);

            _registered = true;
        }
    }
}

/// <summary>
/// Prevents the driver's default behavior of mapping a member named `Id` to the
/// document `_id`. Keeps our integer `id` as a plain field; the auto-assigned
/// ObjectId `_id` is then just an ignored extra element.
/// </summary>
public sealed class NoIdMemberConvention : ConventionBase, IClassMapConvention
{
    public void Apply(BsonClassMap classMap) => classMap.SetIdMember(null);
}
