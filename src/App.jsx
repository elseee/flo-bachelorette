import React, { useEffect, useMemo, useRef, useState } from "react";
import styled, { createGlobalStyle, css } from "styled-components";

/**
 * Tinder-style Swipe Game (no Tailwind, no edit mode)
 * - React + styled-components
 * - Touch + mouse drag
 * - Keyboard: ← / → to swipe, R to reset
 *
 * Setup:
 *   pnpm add styled-components
 * (Optional typings if TS: pnpm add -D @types/styled-components)
 */

// --- Customize your deck here ---
const DECK = [
  {
    id: "la",
    name: "Larissa",
    maleName: 'Leo',
    bio: "Zorgzame treingekkie die haar reizen ook graag op de fiets maakt. Stap jij in/bij mij achterop?",
    image: "images/larissa.png",
  },
  {
    id: "fenna",
    name: "Fenna",
    maleName: 'Jasper',
    bio: `Liefhebber van wijn die weet hoe hij jouw kurk moet poppen 😏 Psycholoog van beroep, dus kruip graag onder je huid (en ook in je bed). Mijn kat is mijn grootste liefde, maar zoek nog een echte stoeipoes.`,
    image: "images/fenna.jpeg",
  },
  {
    id: "michelle",
    name: "Michelle",
    maleName: 'Roderick',
    bio: `Amore, samen naar Italië? Normaal zouden we gaan vliegen maar tegewoordig kies ik de trein.`,
    image: "images/michelle.png",
  },
  {
    id: "bette",
    name: "Bette",
    maleName: 'Peter',
    bio: `Hey leukerd! Ik houd van avontuurlijke sporten, lekker uit eten gaan of koken. Ik ben altijd in voor een feestje en als je het koud hebt houd ik je slaapzak warm en zing een liedje voor je.`,
    image: "images/bette.png",
  },
  {
    id: "mariette",
    name: "Mariëtte",
    maleName: 'Leandro',
    bio: `Fitboy! Beest in de gym (en niet alleen in de gym). Voor mij geen alcohol, liever eiwitshakes. Docent op de Hogeschool. Dietist voor topsporters.. Woon in een paleis met een koning, maar altijd in voor een swing!`,
    image: "images/mariette.jpeg",
  },
  {
    id: 'lotte',
    name: 'Lotte',
    maleName: 'Jordy',
    bio: `Hey knapperd!
Klaar voor avontuur en romantiek?
Ik hou van goede wijnen, heerlijk eten en feestjes. Het liefst samen met een mooie vrouw aan mijn zijde aan de andere kant van de wereld.
Mijn levensmotto: leef je leven met liefde en lef!`,
    image: 'images/lotte.jpeg',
  },
  {
    id: 'alex',
    name: 'Alex',
    maleName: 'Cas',
    bio: `Bourgondiër in hart en nieren met een flinke talen "knobbel". 
Doordeweeks ben ik regelmatig te vinden op de padelbaan. Wil jij met mij een keer gemengd dubbel spelen?`,
    image: 'images/alex.jpeg',
  },
  {
    id: 'manel',
    name: 'Manel',
    maleName: 'Remco',
    bio: `Hello you! Ben jij opzoek naar een exotisch uistapje? Dan ben ik de man voor jou! Party-animal tijdens de studententijd maar tegenwoordig strak in pak in de corporate world. In mijn vrije tijd drink ik graag een glas wijn of ga ik de bergen in. Voorkeur voor een dame met een Brits accent maar misschien maak ik voor jou wel een uitzondering ;)`,
    image: 'images/manel.png',
  },
  {
    id: 'mieke',
    name: 'Mieke',
    maleName: 'Bart',
    bio: `Hou van een goed feestje, maar net zo van een avond koken met een mooi glas wijn. 
Zoek iemand die mee wil lachen, proosten en misschien mijn kookkunsten wil testen 😉`,
    image: 'images/mieke.jpeg',
  },
    {
    id: 'else',
    name: 'Else',
    maleName: 'Richard',
    bio: `Sociaal, nieuwsgierig en altijd in voor een goed verhaal.
Grote kans dat je mij vindt op een terras met een glas wijn of ergens onderweg naar het volgende avontuur.
Bonuspunten als je mijn vriend(inn)en ook leuk vindt, die hebben namelijk altijd een mening.
`,
    image: 'images/else.png',
  },
  {
    id: 'cherissa',
    name: 'Cherissa',
    maleName: 'Chris',
    bio: `Arm of rijk? Dat maakt me echt niks uit. Als jij oprecht bent en een goed gesprek kan voeren, zit je al goed.
Ik val op een stoere vrouw met een zacht hart. Iemand die van kinderen houdt en mijn boefjes met liefde én een beetje pit aankan.`,
    image: 'images/cherissa.jpeg',
  },
  {
    id: 'eline',
    name: 'Eline',
    maleName: 'Sjors',
    bio: `Vogelspotter extraordinaire! Fan van zonsondergangen, strandwandelingen en het identificeren van gevederde vrienden… tweet me! Laten we samen fluiten en kijken waar onze liefde kan vliegen!`,
    image: 'images/eline.jpeg',
  },
  {
    id:'merel',
    name:'Merel',
    maleName:'Maarten',
    bio: `Ik ben misschien van de regels, maar ik weet precies wanneer je ze een beetje moet buigen.
Goede gesprekken, speelse humor en een zwak voor iemand die mij scherp houdt.

Zullen we onderzoeken of er sprake is van wederzijdse wilsovereenstemming?
Dan verklaar ik deze date bij deze voor geopend.`,
    image: 'images/merel.jpeg',
  },
  {
    id: 'emmy',
    name: 'Emmy',
    maleName: 'Sven',
    bio: `Gaat jouw hart ook sneller kloppen van natuurwandelingen, taart en eerste generatie Pokémon? Scroll dan niet verder! Laat je blije kind de vrij loop of maak een filosofisch uitstapje met mij. Dan snuif ik met plezier jouw versgebakken muffin op.`,
    image: 'images/emmy.jpeg',
  }
];

const Global = createGlobalStyle`
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  html, body { height: 100%;  }
  body {
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    background: radial-gradient(1200px 700px at 10% 0%, rgba(255, 77, 141, 0.15), transparent 55%),
                radial-gradient(900px 600px at 90% 10%, rgba(99, 102, 241, 0.14), transparent 55%),
                linear-gradient(180deg, #06060a, #0b0b12 45%, #0b0b12);
    color: rgba(255,255,255,0.92);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  button, input, textarea { font-family: inherit; }
`;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function useEventListener(eventName, handler, element = window) {
  const savedHandler = useRef();
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(() => {
    if (!element?.addEventListener) return;
    const listener = (e) => savedHandler.current?.(e);
    element.addEventListener(eventName, listener);
    return () => element.removeEventListener(eventName, listener);
  }, [eventName, element]);
}

export default function App() {
  const deck = useMemo(() => DECK, []);
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([]); // { id, dir, ts }
  const [withRealInfo, setWithRealInfo] = useState(false);

  const remaining = Math.max(0, deck.length - index);
  const liked = history.filter((h) => h.dir === "right").length;
  const noped = history.filter((h) => h.dir === "left").length;

  const onSwipe = (dir) => {
      if (index >= deck.length) return;
      const current = deck[index];
      if (!withRealInfo) {
        setHistory((h) => [{ id: current.id, dir, ts: Date.now() }, ...h]);
      }
      setIndex((i) => i + 1);

  };

  const reset = () => {
    setWithRealInfo(true);
    setIndex(0);
  };

  useEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") onSwipe("left");
    if (e.key === "ArrowRight") onSwipe("right");
  });

  const likedProfiles = useMemo(() => {
    const likedIds = new Set(history.filter((h) => h.dir === "right").map((h) => h.id));
    return deck.filter((p) => likedIds.has(p.id));
  }, [history, deck]);

  const nopedProfiles = useMemo(() => {
    const nopedIds = new Set(history.filter((h) => h.dir === "left").map((h) => h.id));
    return deck.filter((p) => nopedIds.has(p.id));
  }, [history, deck]);

  const hasReachedEnd = index >= deck.length; 
  return (
    <>
      <Global />
      <Page>
        <Wrap>
          <Header>
            <div>
              <Title>Matches van Floor</Title>
            </div>
            <Pill>
              <span>❤️ {liked}</span>
              <Dot />
              <span>❌ {noped}</span>
            </Pill>
          </Header>

          <StatsCard>
            <StatRow>
              <span>
                {remaining} / {deck.length} over
              </span>
              <span>
                {deck.length - remaining} gedaan
              </span>
            </StatRow>
            <Bar>
              <BarFill style={{ width: `${deck.length ? ((deck.length - remaining) / deck.length) * 100 : 0}%` }} />
            </Bar>
          </StatsCard>

          <StackArea>
            {hasReachedEnd ? (
              <EndScreen
                liked={likedProfiles}
                noped={nopedProfiles}
                onReset={reset}
              />
            ) : (
              <CardStack
                cards={deck.slice(index, index + 3)}
                onSwipe={onSwipe}
                disabled={index >= deck.length}
                withRealName={withRealInfo}
                history={history}
              />
            )}
          </StackArea>
        </Wrap>
      </Page>
    </>
  );
}

function EndScreen({ liked, noped, onReset }) {
  return (
    <EndCard>
      <EndMessage>
        <strong>Floortje,</strong> als je het nog niet door had, dit waren wij natuurlijk.
      </EndMessage>

      <DrinkCallout>
        <div>🍻 <strong>Belangrijk:</strong> iedereen die in <strong>“Wel daten”</strong> staat moet drinken!</div>
      </DrinkCallout>

      <Grid>
        <Col>
          <ColTitle>❤️ Wel daten</ColTitle>
          {liked.length ? (
            <NameList>
              {liked.map((p) => (
                <NamePill key={p.id}>🥂 {p.name}</NamePill>
              ))}
            </NameList>
          ) : (
            <EmptyText>Niemand… harsh 😅</EmptyText>
          )}
        </Col>

        <Col>
          <ColTitle>❌ Niet daten</ColTitle>
          {noped.length ? (
            <NameList>
              {noped.map((p) => (
                <NamePill key={p.id}>🙅 {p.name}</NamePill>
              ))}
            </NameList>
          ) : (
            <EmptyText>Iedereen is een match?! 👀</EmptyText>
          )}
        </Col>
      </Grid>

      <EndButtons>
        <GhostButton onClick={onReset}>Wie was wie?</GhostButton>
      </EndButtons>
    </EndCard>
  );
}

function CardStack({ cards, onSwipe, disabled, withRealName, history }) {
  return (
    <Stack>
      {cards.length === 0 ? (
        <DoneCard>
          <div>
            <DoneTitle>Deck klaar 🎉</DoneTitle>
            <DoneSub>Reset om opnieuw te spelen.</DoneSub>
          </div>
        </DoneCard>
      ) : (
        cards
          .slice()
          .reverse()
          .map((p, i) => {
            const isTop = i === cards.length - 1;
            const depth = cards.length - 1 - i;
            return (
              <SwipeCard
                key={p.id}
                profile={p}
                onSwipe={onSwipe}
                disabled={disabled || !isTop}
                depth={depth}
                withRealName={withRealName}
                previousSwipe={history.find((h) => h.id === p.id)?.dir}
              />
            );
          })
      )}
    </Stack>
  );
}

function SwipeCard({ profile, onSwipe, disabled, depth, withRealName, previousSwipe }) {
  const ref = useRef(null);
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0, rot: 0 });

  const [ui, setUi] = useState({ x: 0, y: 0, rot: 0, transitioning: false });
  const threshold = 110;

  const apply = (next, transitioning = false) => {
    pos.current = next;
    setUi({ ...next, transitioning });
  };

  const setTransform = (x, y) => {
    const rot = clamp(x / 12, -18, 18);
    apply({ x, y, rot }, false);
  };

  const down = (e) => {
    if (disabled) return;
    const pt = getPoint(e);
    dragging.current = true;
    start.current = { x: pt.x, y: pt.y };
    apply({ ...pos.current }, false);
    try {
      ref.current?.setPointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  const move = (e) => {
    if (disabled) return;
    if (!dragging.current) return;
    const pt = getPoint(e);
    const dx = pt.x - start.current.x;
    const dy = pt.y - start.current.y;
    setTransform(dx, dy);
  };

  const up = () => {
    if (disabled) return;
    if (!dragging.current) return;
    dragging.current = false;

    const { x, y } = pos.current;
    if (Math.abs(x) > threshold) {
      const dir = x > 0 ? "right" : "left";
      const targetX = x > 0 ? 900 : -900;
      const targetY = y + (Math.random() * 120 - 60);
      apply({ x: targetX, y: targetY, rot: clamp(targetX / 12, -25, 25) }, true);
      window.setTimeout(() => onSwipe(dir), 180);
    } else {
      apply({ x: 0, y: 0, rot: 0 }, true);
      window.setTimeout(() => apply({ x: 0, y: 0, rot: 0 }, false), 180);
    }
  };

  // Touch fallback
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onTouchStart = (e) => {
      if (disabled) return;
      const t = e.touches[0];
      dragging.current = true;
      start.current = { x: t.clientX, y: t.clientY };
    };
    const onTouchMove = (e) => {
      if (disabled) return;
      if (!dragging.current) return;
      const t = e.touches[0];
      setTransform(t.clientX - start.current.x, t.clientY - start.current.y);
    };
    const onTouchEnd = () => up();

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  const likeOpacity = previousSwipe === "right" ? 100 : clamp((ui.x - 30) / 120, 0, 1);
  const nopeOpacity = previousSwipe === "left" ? 100 : clamp((-ui.x - 30) / 120, 0, 1);

  const depthTransform = `translateY(${depth * 8}px) scale(${1 - depth * 0.03})`;
  const dragTransform = `translate(${ui.x}px, ${ui.y}px) rotate(${ui.rot}deg)`;

  return (
    <Card
      ref={ref}
      $disabled={disabled}
      $transitioning={ui.transitioning}
      style={{
        transform: `${depthTransform} ${dragTransform}`,
        filter: depth > 0 ? "saturate(0.92)" : "none",
      }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      <Bg>
        <img src={profile.image} alt={profile.name} />
      </Bg>
      <Overlay />

      <StampLeft style={{ opacity: likeOpacity }}>
        <StampInner $variant="like">LIKE ❤️</StampInner>
      </StampLeft>
      <StampRight style={{ opacity: nopeOpacity }}>
        <StampInner $variant="nope">NOPE ❌</StampInner>
      </StampRight>

      <CardContent>
        <TopLine>
          <NameLine>
            {profile.maleName} {withRealName ? `(${profile.name})` : ''}
          </NameLine>
        </TopLine>
        <Bio>{profile.bio}</Bio>
      </CardContent>
    </Card>
  );
}

function getPoint(e) {
  if ("clientX" in e) return { x: e.clientX, y: e.clientY };
  return { x: 0, y: 0 };
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s-7-4.6-9.5-8.7C.3 8.6 2.2 5.5 5.6 5.2c1.8-.2 3.4.7 4.4 2 1-1.3 2.6-2.2 4.4-2 3.4.3 5.3 3.4 3.1 7.1C19 16.4 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------- styled-components ----------------

const Page = styled.div`
  min-height: 100dvh;
  width: 100%;
  padding: 22px 16px 40px;
`;

const Wrap = styled.div`
  max-width: 420px;
  width: calc(100dvw - 30px);
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const Title = styled.div`
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const Sub = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
`;

const Pill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
`;

const Dot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
`;

const StatsCard = styled.div`
  margin-top: 14px;
  border-radius: 22px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
`;

const Bar = styled.div`
  margin-top: 10px;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

const BarFill = styled.div`
  height: 100%;
  background: rgba(255, 255, 255, 0.75);
`;

const StackArea = styled.div`
  margin-top: 14px;
`;

const Controls = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const BottomRow = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Hint = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
  text-align: right;
  flex: 1;
`;

const GhostButton = styled.button`
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 10px 14px;
  font-weight: 650;
  font-size: 13px;
  cursor: pointer;
  transition: transform 120ms ease, background 120ms ease;
  &:hover { background: rgba(255, 255, 255, 0.085); }
  &:active { transform: scale(0.98); }
`;

const ActionButton = styled.button`
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 20px;
  padding: 12px 14px;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
  transition: transform 120ms ease, filter 120ms ease, background 120ms ease;

  ${(p) =>
    p.$variant === "like"
      ? css`
          background: rgba(255, 255, 255, 0.92);
          color: #0b0b12;
          &:hover { filter: brightness(0.98); }
        `
      : css`
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.92);
          &:hover { background: rgba(255, 255, 255, 0.11); }
        `}

  &:active { transform: scale(0.985); }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Stack = styled.div`
  position: relative;
  height: 520px;
  width: 100%;
`;

const DoneCard = styled.div`
  height: 100%;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: grid;
  place-items: center;
  text-align: center;
`;

const DoneTitle = styled.div`
  font-size: 22px;
  font-weight: 900;
`;

const DoneSub = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
`;

const Card = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 32px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 26px 80px rgba(0, 0, 0, 0.55);
  user-select: none;
  touch-action: none;

  ${(p) =>
    p.$transitioning &&
    css`
      transition: transform 180ms ease;
    `}

  ${(p) =>
    p.$disabled
      ? css`
          cursor: default;
        `
      : css`
          cursor: grab;
          &:active {
            cursor: grabbing;
          }
        `}
`;

const Bg = styled.div`
  position: absolute;
  inset: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.25) 45%, rgba(0, 0, 0, 0.82));
`;

const CardContent = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 18px;
`;

const TopLine = styled.div``;

const NameLine = styled.div`
  font-size: 26px;
  font-weight: 950;
  letter-spacing: -0.02em;
`;

const Age = styled.span`
  margin-left: 10px;
  font-size: 16px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.7);
`;

const Role = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.78);
`;

const Bio = styled.div`
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.86);
`;

const StampLeft = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  transform: rotate(-8deg);
  pointer-events: none;
`;

const StampRight = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  transform: rotate(8deg);
  pointer-events: none;
`;

const StampInner = styled.div`
  padding: 10px 14px;
  border-radius: 18px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  background: rgba(0, 0, 0, 0.18);
  font-weight: 950;
  letter-spacing: 0.04em;

  ${(p) =>
    p.$variant === "like"
      ? css`
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        `
      : css`
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        `}
`;

const EndCard = styled.div`
  height: 520px;
  max-height: calc(100dvh - 220px); /* voorkomt dat hij buiten je scherm valt */
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 18px;
  box-shadow: 0 26px 80px rgba(0, 0, 0, 0.45);

  display: flex;
  flex-direction: column;
  overflow: hidden; /* belangrijk */
`;

const EndMessage = styled.div`
  margin-top: 10px;
  font-size: 16px;
  color: rgba(255,255,255,0.8);
  line-height: 1.35;
`;

const DrinkCallout = styled.div`
  font-size: 12px;
  margin-top: 12px;
  padding: 12px 12px;
  border-radius: 18px;
  background: rgba(255, 77, 141, 0.10);
  border: 1px solid rgba(255, 77, 141, 0.25);
  color: rgba(255,255,255,0.92);

  small {
    display: block;
    margin-top: 6px;
    color: rgba(255,255,255,0.6);
    font-size: 12px;
  }
`;

const Grid = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  flex: 1;              /* neemt resterende ruimte in de EndCard */
  min-height: 0;        /* belangrijk voor overflow in flex parents */
  overflow: auto;       /* scroll alleen hier */

  -webkit-overflow-scrolling: touch;
`;

const Col = styled.div`
  padding: 12px;
  border-radius: 18px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.10);
`;

const ColTitle = styled.div`
  font-size: 13px;
  font-weight: 900;
  margin-bottom: 10px;
`;

const NameList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NamePill = styled.div`
  padding: 8px;
  border-radius: 16px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  font-size: 13px;
  font-weight: 800;
`;

const EmptyText = styled.div`
  font-size: 13px;
  color: rgba(255,255,255,0.6);
`;

const EndButtons = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: center;
  flex-shrink: 0; /* voorkomt dat hij “mee krimpt” */
`;