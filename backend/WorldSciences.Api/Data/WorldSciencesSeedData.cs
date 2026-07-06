using WorldSciences.Api.Models;

namespace WorldSciences.Api.Data;

public static class WorldSciencesSeedData
{
    public static readonly IReadOnlyList<Author> Authors =
    [
        new(
            1,
            "Tejas B.",
            "tejas-b",
            null,
            "Writer focused on politics, science, and global affairs."),
        new(
            2,
            "Shiv R.",
            "shiv-r",
            null,
            "Contributor covering history, technology, and culture."),
        new(
            3,
            "Kyle L.",
            "kyle-l",
            null,
            "Contributor covering international politics and security.")
    ];

    public static readonly IReadOnlyList<Topic> Topics =
    [
        new(1, "Geopolitical Strategy", "geopolitical-strategy"),
        new(2, "Iran", "iran"),
        new(3, "Israel", "israel"),
        new(4, "Lebanon", "lebanon"),
        new(5, "Cryptocurrency", "cryptocurrency"),
        new(6, "Sanctions", "sanctions"),
        new(7, "United Nations", "united-nations"),
        new(8, "U.S. Foreign Policy", "us-foreign-policy")
    ];

    public static readonly IReadOnlyList<Article> Articles =
    [
        new(
            1,
            "israels-strategy-in-lebanon-is-hezbollahs-best-recruitment-tool",
            "Israel's Strategy in Lebanon is Hezbollah's Best Recruitment Tool",
            "Israel's strategy to levy military pressure on Hezbollah victimizes Lebanese civilians, which bolsters support for Hezbollah in the long term.",
            1,
            new DateOnly(2026, 6, 11),
            "6 min read",
            "http://static1.squarespace.com/static/69b86faaadfca82c7abc540e/69b88aa91f10a10436634583/6a2ae811a5093e204b5fb03d/1781199126610/2023_Hezbollah_drill_in_Aaramta_04.jpg?format=1500w",
            ["Israel", "Lebanon", "Hezbollah", "Middle East"],
            [
                new ArticleContentBlock(
                    1,
                    "paragraph",
                    Text: "Israel's strategy to levy military pressure on Hezbollah victimizes Lebanese civilians, which bolsters support for Hezbollah in the long term.")
            ]),
        new(
            2,
            "cryptocurrency-crippled-the-american-sanctions-regime-trump-delivered-the-final-blow",
            "Cryptocurrency Crippled the American Sanctions Regime. Trump Delivered the Final Blow",
            "President Trump has systematically neutered his own campaign of maximum pressure against the Iranian economy by prioritizing his investments in the cryptocurrency industry over national security.",
            1,
            new DateOnly(2026, 6, 4),
            "5 min read",
            "http://static1.squarespace.com/static/69b86faaadfca82c7abc540e/69b88aa91f10a10436634583/6a21b9e949da7d04e5b48f1c/1780596672009/Donald_Trump_signing_EO_on_Iran_sanctions_P20180805SC-0480.jpg?format=1500w",
            ["Sanctions", "Cryptocurrency", "Iran", "U.S. Foreign Policy"],
            [
                new ArticleContentBlock(
                    1,
                    "paragraph",
                    Text: "President Trump has systematically weakened his own campaign of maximum pressure against the Iranian economy.")
            ]),
        new(
            3,
            "pauyxfmtcysyyfi6btipjg2jr8d79q",
            "How the MAGA Doctrine is Influencing the Race for UN Secretary General",
            "The United Nations Secretary-General usually draws significant interest from the White House given the U.N.'s role in international affairs.",
            1,
            new DateOnly(2026, 5, 17),
            "7 min read",
            "http://static1.squarespace.com/static/69b86faaadfca82c7abc540e/69b88aa91f10a10436634583/6a0a24f983278e72cc2da491/1779063471990/President_Donald_J._Trump_at_the_United_Nations_General_Assembly_%2843978172875%29.jpg?format=1500w",
            ["United Nations", "International Institutions", "U.S. Foreign Policy"],
            [
                new ArticleContentBlock(
                    1,
                    "paragraph",
                    Text: "The United Nations Secretary-General race offers a useful window into the changing relationship between American politics and multilateral institutions.")
            ])
    ];
}
