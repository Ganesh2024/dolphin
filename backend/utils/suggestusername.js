function generateSuggestedUsernames(username) {
  const suggestedUsernames = [];
  for (let i = 1; i <= 5; i++) {
    suggestedUsernames.push(`${username}${Math.floor(Math.random() * 10000)}`);
  }
  return suggestedUsernames;
}

module.exports = {generateSuggestedUsernames}