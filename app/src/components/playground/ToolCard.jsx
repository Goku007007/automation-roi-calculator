import { ZapierIcon, MakeIcon, N8nIcon, PowerAutomateIcon, CheckIcon } from '../ui/Icons';
import styles from './ToolCard.module.css';

// Map icon names to components
const iconComponents = {
    ZapierIcon,
    MakeIcon,
    N8nIcon,
    PowerAutomateIcon,
};

export default function ToolCard({ tool, isSelected, onSelect }) {
    const IconComponent = iconComponents[tool.iconName] || ZapierIcon;

    return (
        <button
            type="button"
            className={`${styles.card} ${isSelected ? styles.selected : ''}`}
            onClick={onSelect}
            aria-pressed={isSelected}
        >
            <div className={styles.header}>
                <span className={styles.logo}>
                    <IconComponent size={24} />
                </span>
                <h3 className={styles.name}>{tool.name}</h3>
            </div>
            <p className={styles.description}>{tool.description}</p>
            <div className={styles.pricing}>
                <span className={styles.from}>From</span>
                <span className={styles.price}>
                    {tool.tiers[0].price === 0 ? 'Free' : `$${tool.tiers[0].price}/mo`}
                </span>
            </div>
            {isSelected && (
                <div className={styles.checkmark} aria-hidden="true">
                    <CheckIcon size={16} />
                </div>
            )}
        </button>
    );
}
