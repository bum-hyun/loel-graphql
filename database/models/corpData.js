module.exports = (sequelize, DataTypes) => {
	const CorpData = sequelize.define(
		"CorpData",
		{
			corp_code: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false
			},
			stock_code: {
				type: DataTypes.STRING,
				allowNull: false
			},
			stock_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			data: {
				type: DataTypes.STRING,
			},
		},
		{
			underscored: true,
			charset: 'utf8mb4',
			collate: 'utf8mb4_general_ci',
			paranoid: false,
			modelName: 'CorpData',
			tableName: 'corpData',
			timestamps: false
		},
	);

	CorpData.associate = (models) => {
	}

	return CorpData;
}
