import '../../styles/Sprites.css';

const SPRITE_CLASSES = {
  merlin: {
    neutral: 'sprite-merlin-neutral',
    happy: 'sprite-merlin-happy',
    angry: 'sprite-merlin-angry',
  },
  player: {
    normal: 'sprite-player-normal',
    worried: 'sprite-player-worried',
    neutral: 'sprite-player-normal',
  },
};

export default function PixelSprite({ character = 'merlin', emotion = 'neutral', animate = true }) {
  const classMap = SPRITE_CLASSES[character] || SPRITE_CLASSES.merlin;
  const spriteClass = classMap[emotion] || classMap.neutral || classMap.normal;
  const idleClass = animate ? 'sprite-idle' : '';

  return (
    <div className="sprite-container">
      <div className={`sprite ${spriteClass} ${idleClass}`} />
    </div>
  );
}
