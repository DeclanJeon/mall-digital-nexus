// Utility functions for handling media in post content

/**
 * Checks if a string is a valid URL
 */
export const isValidUrl = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * Extracts YouTube video ID from a YouTube URL
 */
export const extractYoutubeId = (url: string): string | null => {
  if (!isValidUrl(url)) return null;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
};

/**
 * Converts a YouTube URL to an embed iframe
 */
export const convertYoutubeUrlToEmbed = (url: string): string | null => {
  const videoId = extractYoutubeId(url);
  if (!videoId) return null;

  return `<iframe 
      width="100%" 
      height="315" 
      src="https://www.youtube.com/embed/${videoId}" 
      title="YouTube video player" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen
    ></iframe>`;
};

/**
 * Process content text to enhance with media embeds
 */
export const processContentWithMediaEmbeds = (content: string): string => {
  if (!content) return '';

  // Check if content is HTML (from rich text editor)
  if (content.includes('<') && content.includes('>')) {
    // Process URLs in HTML content
    let processedContent = content;

    // Find all URLs in the content
    const urlRegex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const urls = content.match(urlRegex) || [];

    // Process each URL found
    urls.forEach((url) => {
      // Check if it's a YouTube URL and not already in an iframe
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        // Check if this URL is not already in an iframe
        const isInIframe = new RegExp(`<iframe[^>]*${url}[^>]*>`).test(content);
        if (!isInIframe) {
          const youtubeEmbed = convertYoutubeUrlToEmbed(url);
          if (youtubeEmbed) {
            // Replace the URL with the iframe, but only if it's a standalone link
            // (not part of an a tag or iframe already)
            const isStandalone = new RegExp(
              `>[\\s]*${url.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}[\\s]*<`
            ).test(content);
            if (isStandalone) {
              processedContent = processedContent.replace(
                new RegExp(
                  `>\\s*${url.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*<`,
                  'g'
                ),
                `>${youtubeEmbed}<`
              );
            }
          }
        }
      }
    });

    return processedContent;
  }

  // For plain text content, process line by line (keeping existing code)
  const lines = content.split('\n');

  const processedLines = lines.map((line) => {
    // Check if line is a standalone URL
    const trimmedLine = line.trim();
    if (isValidUrl(trimmedLine)) {
      // Check if it's a YouTube URL
      const youtubeEmbed = convertYoutubeUrlToEmbed(trimmedLine);
      if (youtubeEmbed) {
        return youtubeEmbed;
      }

      // For other URLs, can add other embed types later
      // For now, just return a clickable link
      return `<a href="${trimmedLine}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${trimmedLine}</a>`;
    }

    return line;
  });

  return processedLines.join('\n');
};

/**
 * Process editor content to embed media before saving
 */
export const processEditorContentForSave = (richContent: string): string => {
  if (!richContent) return '';

  return processContentWithMediaEmbeds(richContent);
};
