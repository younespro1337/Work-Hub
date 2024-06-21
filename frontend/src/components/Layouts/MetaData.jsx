import { Helmet } from "react-helmet";

const MetaData = ({ title }) => {
    console.log(title);
    return (
        <Helmet>
            <title>{title}</title>
        </Helmet>
    );
};

export default MetaData;
