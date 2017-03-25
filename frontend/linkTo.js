export default function(destination, text = destination) {
  const link = document.createElement('a');
  link.href = destination + '.html';
  link.text = text;
  return link;
}
