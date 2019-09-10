module.exports = {
    port: 3000,
    redis: {
        host: "sendinfo.redis.com",
        port: 6379,
        ttl: 30 * 60,
        db:2
    },
    debug:true,
    idCard:{
        grant_type:'client_credentials',
        client_id: 'QmovrRYcGfmU9Ngq1Sg5QFxt',
        client_secret: 'LeWZ9YEjvXGaPD8fEZyLEAT6aXA9p6tB'
    },
}
