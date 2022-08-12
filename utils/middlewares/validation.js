import withJoi from 'next-joi';

const validate = withJoi({
    onValidationError: (req, res, err) => {
        console.log(err);
        return res
            .status(400)
            .json({ message: 'Request query format is invalid' });
    }
});

export default validate;
