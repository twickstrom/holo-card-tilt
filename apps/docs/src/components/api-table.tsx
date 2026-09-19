"use client";

import {Table} from "@heroui/react";

export interface ApiRow {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
}

interface ApiTableProps {
  label: string;
  nameHeading?: string;
  rows: ApiRow[];
  typeHeading?: string;
}

export function ApiTable({label, nameHeading = "Prop", rows, typeHeading = "Type"}: ApiTableProps) {
  return (
    <Table variant="secondary">
      <Table.ScrollContainer>
        <Table.Content aria-label={label} className="min-w-[720px]">
          <Table.Header>
            <Table.Column isRowHeader>{nameHeading}</Table.Column>
            <Table.Column>{typeHeading}</Table.Column>
            <Table.Column>Default</Table.Column>
            <Table.Column>Description</Table.Column>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <Table.Row key={row.name} id={row.name}>
                <Table.Cell>
                  <code className="text-accent font-mono text-sm">{row.name}</code>
                </Table.Cell>
                <Table.Cell>
                  <code className="text-muted font-mono text-xs">{row.type}</code>
                </Table.Cell>
                <Table.Cell>
                  <code className="font-mono text-xs">{row.defaultValue ?? "-"}</code>
                </Table.Cell>
                <Table.Cell className="text-sm">{row.description}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
