module.exports = {
    port:'4029',
    redis: {
        host: "192.168.200.50",
        port: 6379,
        ttl: 30 * 60,
        db:2
    },
    debug:true,
    idCard:{
        grant_type:'client_credentials',
        client_id: 'tG13Z8Px6FClmzMYw2PYZd1z',
        client_secret: 'N8rzh1U47NxfxpqPCytCdvv3h3asB11r'
    },
};
