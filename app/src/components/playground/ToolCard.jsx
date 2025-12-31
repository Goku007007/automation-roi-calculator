import styles from './ToolCard.module.css';

export default function ToolCard({ tool, isSelected, onSelect }) {
    return (
        <div
            className={`${styles.card} ${isSelected ? styles.selected : ''}`}
            onClick={onSelect}
        >
            <div className={styles.header}>
                <span className={styles.logo}>{tool.logo}</span>
                <h3 className={styles.name}>{tool.name}</h3>
            </div>
            <p className={styles.description}>{tool.description}</p>
            <div className={styles.pricing}>
                <span className={styles.from}>From</span>
                <span className={styles.price}>
                    {tool.tiers[0].price === 0 ? 'Free' : `$${tool.tiers[0].price}/mo`}
                </span>
            </div>
            {isSelected && <div className={styles.checkmark}>✓</div>}
        </div>
    );
}
