type GiftBoxProps = {
  open: boolean;
  onOpen: () => void;
};

export function GiftBox({ open, onOpen }: GiftBoxProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={open}
      aria-label={open ? "Gift opened" : "Tap the gift to open"}
      className="gift-btn relative mx-auto block h-[240px] w-[220px] border-0 bg-transparent p-0 disabled:cursor-default"
    >
      <span className="gift-scene">
        <span className={`gift ${open ? "is-open" : ""}`}>
          <span className="gift-lid">
            <span className="gift-bow" />
          </span>
          <span className="gift-body">
            <span className="gift-face" />
          </span>
          <span className="gift-ribbon-v" />
          <span className="gift-ribbon-h" />
        </span>
      </span>
      {!open ? (
        <span className="mt-6 block font-display text-sm tracking-[0.18em] text-primary">
          TAP TO OPEN
        </span>
      ) : null}
    </button>
  );
}
