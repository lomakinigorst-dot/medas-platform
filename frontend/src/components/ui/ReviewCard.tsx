type ReviewCardProps = {
  name: string;
  initials: string;
  date: string;
  rating: number;
  text: string;
  verified?: boolean;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? "text-amber-400" : "text-outline-variant"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewCard({ name, initials, date, rating, text, verified }: ReviewCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,45,98,0.06)] border border-outline-variant/10">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm flex-shrink-0 uppercase">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-sm text-on-surface">{name}</p>
              {verified && (
                <svg className="w-3.5 h-3.5 text-secondary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              )}
            </div>
            <Stars rating={rating} />
          </div>
        </div>
        <span className="text-[10px] text-on-surface-variant whitespace-nowrap pt-0.5">{date}</span>
      </div>
      <p className="text-sm text-on-surface-variant italic leading-relaxed">&ldquo;{text}&rdquo;</p>
    </div>
  );
}
