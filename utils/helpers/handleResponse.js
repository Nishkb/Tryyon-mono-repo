const method = (req, res, resultKey) => (err, results) => {
    if (err) {
        console.log(err);
        if (err.message) err = JSON.parse(err.message);
        const status = err.body.status ? err.body.status : 500;
        const data = err.body.data
            ? err.body.data
            : { message: 'Some error occurred in Api' };
        console.error(`${data.message} ${status}`);
        res.status(status).json({ message: data.message });
    } else {
        res.status(200).json({ ...results[resultKey] });
    }
};

export default method;
