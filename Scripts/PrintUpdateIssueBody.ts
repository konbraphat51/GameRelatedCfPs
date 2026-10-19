// CLI entry: prints the data-update issue body for today's date to stdout.
import { loadVenueDataset } from "../src/Services/VenueRepository";
import { toIsoDate } from "../src/Services/DateUtility";
import { buildUpdateIssueBody } from "./UpdateIssueBuilder";

process.stdout.write(buildUpdateIssueBody(loadVenueDataset(), toIsoDate(new Date())));
