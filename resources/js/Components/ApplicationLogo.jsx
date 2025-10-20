import black from "../../img/black-transparent (1).png";
import white from "../../img/for-dark-background.png";
import anjo from "../../img/anjo-logo.png";
export default function ApplicationLogo(props) {
    return (
        <div {...props}>
            {/* Light mode logo */}
            <img src={anjo} alt="Logo" className="block dark:hidden h-full" />

            {/* Dark mode logo */}
            <img src={anjo} alt="Logo" className="hidden dark:block h-full" />
        </div>
    );
}
