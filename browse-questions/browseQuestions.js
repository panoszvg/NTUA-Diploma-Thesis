exports.show = (req, res, next) => {
    res.status(200).json({ message: 'OK', type: 'success' });
}