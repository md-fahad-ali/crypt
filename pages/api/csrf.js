import csurf from 'csurf'


export function csrf(req, res) {
    return new Promise((resolve, reject) => {
        csurf({ cookie: true })(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }
            return resolve(result)
        })
    })
}

export default csrf