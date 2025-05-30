import { Seeder } from './seeder';
import logger from './logger';

/**
 * Class for running the seeding process
 */
export class SeedRunner {
  /**
   * Run the seeding process
   */
  static async run(): Promise<void> {
    try {
      // Check for --init flag to initialize only without data seeding
      const initOnly = process.argv.includes('--init');

      const seeder = new Seeder();
      if (initOnly) {
        logger.info('Running in initialization-only mode. No data will be seeded.');
        await seeder.initOnly();
      } else {
        await seeder.seed();
      }
    } catch (error) {
      logger.error(`Critical error: ${error}`);
      process.exit(1);
    }
  }
}

// Start seeding
SeedRunner.run(); 