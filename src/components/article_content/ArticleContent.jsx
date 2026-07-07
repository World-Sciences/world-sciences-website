import { Box, Typography } from "@mui/material";

export default function ArticleContent({ blocks = [] }) {
  return blocks.map((block, index) => {
    if (block.type === "paragraph") {
      return (
        <Typography
          key={index}
          variant="body1"
          sx={{
            fontSize: "1.15rem",
            lineHeight: 1.9,
            mb: 3,
          }}
        >
          {block.text}
        </Typography>
      );
    }

    if (block.type === "image") {
      return (
        <Box key={index} sx={{ my: 5 }}>
          <Box
            component="img"
            src={block.src}
            alt={block.alt || ""}
            sx={{
              width: "100%",
              borderRadius: 2,
              display: "block",
            }}
          />

          {block.caption && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 1,
                fontStyle: "italic",
              }}
            >
              {block.caption}
            </Typography>
          )}
        </Box>
      );
    }

    if (block.type === "heading") {
      return (
        <Typography key={index} variant="h4" sx={{ mt: 5, mb: 2 }}>
          {block.text}
        </Typography>
      );
    }

    if (block.type === "caption") {
      return (
        <Typography
          key={index}
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 4,
            mb: 2,
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          {block.text}
        </Typography>
      );
    }

    return null;
  });
}
