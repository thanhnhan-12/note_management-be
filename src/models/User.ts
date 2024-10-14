import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

class User extends Model {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public phone!: string;
    public password!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'users',
        sequelize,
        timestamps: true,
    }
);

export default User;
