const { executeQuery } = require('./config/database.js');

(async () => {
  const info = await executeQuery(`
    SELECT COLUMN_NAME, DATA_TYPE, TABLE_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME IN ('DailyPlans', 'Meals', 'Exercises') 
    AND COLUMN_NAME IN ('MealID', 'ExerciseID', 'Id')
    ORDER BY TABLE_NAME, COLUMN_NAME
  `);
  
  console.log('Column Types:');
  info.recordset.forEach(row => {
    console.log(`  ${row.TABLE_NAME}.${row.COLUMN_NAME} = ${row.DATA_TYPE}`);
  });
})().catch(console.error);
