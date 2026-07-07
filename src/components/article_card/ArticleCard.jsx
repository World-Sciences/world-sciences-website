import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { authors } from "../../data/authors";
import ArticleByline from "../article_by_line/ArticleByLine";

export default function ArticleCard({ article }) {
  const author = article.author || authors.find((a) => a.id === article.authorId);
  const displayTopics = article.topics || [article.topic];

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", height: "100%" }}>
      <CardActionArea component={Link} to={`/articles/${article.slug}`} sx={{ height: "100%" }}>
        <CardMedia component="img" height="190" image={article.image} alt={article.title} />
        <CardContent>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {displayTopics.slice(0, 3).map((topic) => (
              <Chip key={topic} label={topic} size="small" />
            ))}
          </Box>

          <Typography variant="h5" gutterBottom>
            {article.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {article.excerpt}
          </Typography>

          <ArticleByline article={article} author={author} />

        </CardContent>
      </CardActionArea>
    </Card>
  );
}
