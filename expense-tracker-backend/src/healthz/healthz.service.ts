import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';

@Injectable()
export class HealthzService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async checkHealth() {
    const startTime = Date.now();

    try {
      // Perform a simple database query to check connectivity and measure latency
      await this.userModel.findOne().limit(1).exec();
      const dbLatency = Date.now() - startTime;

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: {
          status: 'connected',
          latency: `${dbLatency}ms`,
        },
      };
    } catch (error) {
      const dbLatency = Date.now() - startTime;

      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: {
          status: 'disconnected',
          latency: `${dbLatency}ms`,
          error: error.message,
        },
      };
    }
  }
}
