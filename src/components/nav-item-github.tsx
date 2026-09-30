import { GitHubStars } from "@/components/github-stars";
import { SOURCE_CODE_GITHUB_REPO } from "@/constants/site";
import { getStargazerCount } from "@/lib/github/stargazers";

export const NavItemGitHub = async () => {
  const stargazersCount = await getStargazerCount();

  return (
    <GitHubStars
      repo={SOURCE_CODE_GITHUB_REPO}
      stargazersCount={stargazersCount}
    />
  );
};
