import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { authors } from "../../data/authors";

export default function ArticleCard({ article }) {
  const author = authors.find((a) => a.id === article.authorId);

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", height: "100%" }}>
      <CardActionArea component={Link} to={`/articles/${article.slug}`} sx={{ height: "100%" }}>
        <CardMedia component="img" height="190" image={article.image} alt={article.title} />
        <CardContent>
          <Chip label={article.topic} size="small" sx={{ mb: 2 }} />

          <Typography variant="h5" gutterBottom>
            {article.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {article.excerpt}
          </Typography>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar src={author?.avatar} alt={author?.name}>
              {author?.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body2">{author?.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {article.date} · {article.readTime}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
