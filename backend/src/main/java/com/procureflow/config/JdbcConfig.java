package com.procureflow.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

/**
 * JDBC Configuration for High Performance
 * Optimized connection pooling and query performance
 */
@Configuration
@EnableTransactionManagement
public class JdbcConfig {

    @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/procureflow}")
    private String dbUrl;

    @Value("${spring.datasource.username:root}")
    private String dbUsername;

    @Value("${spring.datasource.password:}")
    private String dbPassword;

    @Value("${spring.datasource.driver-class-name:com.mysql.cj.jdbc.Driver}")
    private String driverClassName;

    /**
     * Optimized HikariCP DataSource for MySQL
     */
    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        
        // Database connection settings
        config.setJdbcUrl(dbUrl);
        config.setUsername(dbUsername);
        config.setPassword(dbPassword);
        config.setDriverClassName(driverClassName);
        
        // Connection pool optimization
        config.setMaximumPoolSize(25);           // Max connections
        config.setMinimumIdle(10);               // Minimum idle connections
        config.setConnectionTimeout(30000);      // 30 seconds
        config.setIdleTimeout(300000);           // 5 minutes
        config.setMaxLifetime(900000);           // 15 minutes
        config.setLeakDetectionThreshold(60000); // 1 minute
        
        // Performance optimization
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        config.addDataSourceProperty("useServerPrepStmts", "true");
        config.addDataSourceProperty("useLocalSessionState", "true");
        config.addDataSourceProperty("rewriteBatchedStatements", "true");
        config.addDataSourceProperty("cacheResultSetMetadata", "true");
        config.addDataSourceProperty("cacheServerConfiguration", "true");
        config.addDataSourceProperty("elideSetAutoCommits", "true");
        config.addDataSourceProperty("maintainTimeStats", "false");
        
        // Connection validation
        config.setConnectionTestQuery("SELECT 1");
        config.setValidationTimeout(5000);
        
        // Pool name for monitoring
        config.setPoolName("ProcureFlow-HikariCP");
        
        return new HikariDataSource(config);
    }

    /**
     * Optimized JdbcTemplate
     */
    @Bean
    @Primary
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        
        // Optimization settings
        jdbcTemplate.setFetchSize(100);           // Fetch size for large result sets
        jdbcTemplate.setMaxRows(10000);           // Maximum rows to fetch
        jdbcTemplate.setQueryTimeout(30);         // Query timeout in seconds
        jdbcTemplate.setSkipResultsProcessing(false);
        jdbcTemplate.setSkipUndeclaredResults(false);
        
        return jdbcTemplate;
    }

    /**
     * Transaction Manager for JDBC
     */
    @Bean
    @Primary
    public PlatformTransactionManager transactionManager(DataSource dataSource) {
        DataSourceTransactionManager transactionManager = new DataSourceTransactionManager(dataSource);
        
        // Transaction optimization
        transactionManager.setDefaultTimeout(30); // 30 seconds default timeout
        transactionManager.setRollbackOnCommitFailure(true);
        
        return transactionManager;
    }

    /**
     * Additional JdbcTemplate for read-only operations (can use read replica in production)
     */
    @Bean("readOnlyJdbcTemplate")
    public JdbcTemplate readOnlyJdbcTemplate(DataSource dataSource) {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        
        // Optimized for read operations
        jdbcTemplate.setFetchSize(500);           // Larger fetch size for read operations
        jdbcTemplate.setMaxRows(50000);           // Larger max rows for reports
        jdbcTemplate.setQueryTimeout(60);         // Longer timeout for complex queries
        
        return jdbcTemplate;
    }
}
