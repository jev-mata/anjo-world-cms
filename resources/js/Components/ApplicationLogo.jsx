import black from "../../img/black-transparent (1).png";
import white from "../../img/for-dark-background.png";
export default function ApplicationLogo(props) {
    return (
        <div {...props}>
            {/* Light mode logo */}
            <img src={black} alt="Logo" className="block dark:hidden h-10" />

            {/* Dark mode logo */}
            <img src={white} alt="Logo" className="hidden dark:block h-10" />
        </div>
    );
}
