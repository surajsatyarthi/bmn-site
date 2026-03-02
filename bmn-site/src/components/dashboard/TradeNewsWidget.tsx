import Link from 'next/link';

interface TradeNewsWidgetProps {
  productQuery: string;
  countryQuery: string;
}

export async function TradeNewsWidget({ productQuery, countryQuery }: TradeNewsWidgetProps) {
  const query = encodeURIComponent(`${productQuery} trade export import ${countryQuery}`);
  const url = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;

  const newsItems: { title: string; link: string; source: string; pubDate: string }[] = [];
  let fetchFailed = false;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(url, { 
      next: { revalidate: 3600 },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      throw new Error(`Failed to fetch RSS: ${res.statusText}`);
    }
    const xmlText = await res.text();

    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const titleRegex = /<title>([\s\S]*?)<\/title>/;
    const linkRegex = /<link>([\s\S]*?)<\/link>/;
    const sourceRegex = /<source[^>]*>([\s\S]*?)<\/source>/;
    const pubDateRegex = /<pubDate>([\s\S]*?)<\/pubDate>/;

    let match;
    let count = 0;
    while ((match = itemRegex.exec(xmlText)) !== null && count < 5) {
      const itemXml = match[1];

      const titleMatch = titleRegex.exec(itemXml);
      const linkMatch = linkRegex.exec(itemXml);
      const sourceMatch = sourceRegex.exec(itemXml);
      const pubDateMatch = pubDateRegex.exec(itemXml);

      if (titleMatch && linkMatch) {
        let title = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
        // Google News often appends " - Source Name" to the title, strip it if source exists
        const sourceName = sourceMatch ? sourceMatch[1] : '';
        if (sourceName && title.endsWith(` - ${sourceName}`)) {
          title = title.substring(0, title.length - ` - ${sourceName}`.length);
        }

        newsItems.push({
          title,
          link: linkMatch[1],
          source: sourceName || 'Unknown Source',
          pubDate: pubDateMatch ? new Date(pubDateMatch[1]).toLocaleDateString() : '',
        });
        count++;
      }
    }
  } catch (error) {
    console.error('[TradeNewsWidget] Failed to fetch or parse news:', error);
    fetchFailed = true;
  }

  return (
    <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm mb-6">
      <h2 className="text-xl font-bold font-display text-text-primary mb-4">📰 Trade News</h2>
      
      {fetchFailed || newsItems.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-sm text-text-secondary">No news available right now.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 divide-y divide-gray-100">
          {newsItems.map((item, index) => (
            <div key={index} className={index > 0 ? 'pt-4' : ''}>
              <Link 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-bmn-blue hover:underline font-medium block mb-1"
                dangerouslySetInnerHTML={{ __html: item.title }}
              />
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <span>{item.source}</span>
                {item.pubDate && (
                  <>
                    <span>•</span>
                    <span>{item.pubDate}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
