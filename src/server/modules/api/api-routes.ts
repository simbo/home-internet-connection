import * as Boom from '@hapi/boom';
import { ServerRoute } from '@hapi/hapi';
import { max, subHours } from 'date-fns';
import * as Joi from 'joi';

import { adjustSpeedDateRange } from '../../lib/adjust-speed-date-range';
import { adjustStatusDateRange } from '../../lib/adjust-status-date-range';
import { Speed } from '../database/speed/speed.schema';
import { Status } from '../database/status/status.schema';

export const apiRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/status/latest',
    handler: async (request, h) => {
      const entry = await Status.findLatestStatus();
      return entry ? entry.toResponse() : Boom.notFound();
    }
  },
  {
    method: 'GET',
    path: '/status/last-24-hours',
    handler: async (request, h) => {
      const toDate = new Date();
      const fromDate = subHours(toDate, 24);
      const entries = await Status.findStatusRanged(fromDate, toDate);
      return adjustStatusDateRange(
        entries.map(entry => entry.toResponse()),
        fromDate,
        toDate
      );
    }
  },
  {
    method: 'GET',
    path: '/status/ranged/{fromDateString}/{toDateString}',
    options: {
      validate: {
        params: Joi.object({
          fromDateString: Joi.date().iso(),
          toDateString: Joi.date().iso()
        })
      }
    },
    handler: async (request, h) => {
      const fromDate = new Date(request.params.fromDateString);
      const toDate = max([fromDate, new Date(request.params.toDateString)]);
      const entries = await Status.findStatusRanged(fromDate, toDate);
      return adjustStatusDateRange(
        entries.map(entry => entry.toResponse()),
        fromDate,
        toDate
      );
    }
  },
  {
    method: 'GET',
    path: '/status/since/{sinceDateString}',
    options: {
      validate: {
        params: Joi.object({
          sinceDateString: Joi.date().iso()
        })
      }
    },
    handler: async (request, h) => {
      const sinceDate = new Date(request.params.sinceDateString);
      const entries = await Status.findStatusSince(sinceDate);
      return adjustStatusDateRange(
        entries.map(entry => entry.toResponse()),
        sinceDate,
        new Date()
      );
    }
  },
  {
    method: 'GET',
    path: '/speed/latest',
    handler: async (request, h) => {
      const entry = await Speed.findLatestSpeed();
      return entry ? entry.toResponse() : Boom.notFound();
    }
  },
  {
    method: 'GET',
    path: '/speed/last-24-hours',
    handler: async (request, h) => {
      const toDate = new Date();
      const fromDate = subHours(toDate, 24);
      const entries = await Speed.findSpeedRanged(fromDate, toDate);
      return adjustSpeedDateRange(
        entries.map(entry => entry.toResponse()),
        fromDate,
        toDate
      );
    }
  },
  {
    method: 'GET',
    path: '/speed/ranged/{fromDateString}/{toDateString}',
    options: {
      validate: {
        params: Joi.object({
          fromDateString: Joi.date().iso(),
          toDateString: Joi.date().iso()
        })
      }
    },
    handler: async (request, h) => {
      const fromDate = new Date(request.params.fromDateString);
      const toDate = max([fromDate, new Date(request.params.toDateString)]);
      const entries = await Speed.findSpeedRanged(fromDate, toDate);
      return adjustSpeedDateRange(
        entries.map(entry => entry.toResponse()),
        fromDate,
        toDate
      );
    }
  },
  {
    method: 'GET',
    path: '/speed/since/{sinceDateString}',
    options: {
      validate: {
        params: Joi.object({
          sinceDateString: Joi.date().iso()
        })
      }
    },
    handler: async (request, h) => {
      const sinceDate = new Date(request.params.sinceDateString);
      const entries = await Speed.findSpeedSince(sinceDate);
      return adjustSpeedDateRange(
        entries.map(entry => entry.toResponse()),
        sinceDate,
        new Date()
      );
    }
  }
];
