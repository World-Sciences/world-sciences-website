import { Avatar, Box, Stack, Typography } from "@mui/material";

export default function ArticleByline({ article, author, sx }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={sx}>
      <Avatar src={author?.avatar} alt={author?.name}>
        {author?.name?.charAt(0)}
      </Avatar>

      <Box>
        <Typography variant="body2">{author?.name}</Typography>
        <Typography variant="caption" color="text.secondary">
          {article.date} | {article.readTime}
        </Typography>
      </Box>
    </Stack>
  );
}