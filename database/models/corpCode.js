module.exports = (sequelize, DataTypes) => {
	const CorpCode = sequelize.define(
		"CorpCode",
		{
			code: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			corp_code: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			market: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			underscored: true,
			charset: 'utf8mb4',
			collate: 'utf8mb4_general_ci',
			paranoid: false,
			modelName: 'CorpCode',
			tableName: 'corpCode',
			timestamps: false
		},
	);

	CorpCode.associate = (models) => {
	}

	return CorpCode;
}
