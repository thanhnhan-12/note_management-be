import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

class TokenBlacklist extends Model {
    public id!: number;
    public token!: string;
}

TokenBlacklist.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'token_blacklist',
        sequelize,
    }
);

export default TokenBlacklist;