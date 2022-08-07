import { File as FileAST, JSXElement } from "@babel/types";
import { makeObservable, observable } from "mobx";
import { NodeSelection } from "./NodeSelection";

interface JSXRoot {
  name?: string;
  element: JSXElement;
}

export class SourceFile {
  constructor(ast: FileAST) {
    this.ast = ast;
    this.jsxRoots = this.getJSXRoots();
  }

  readonly ast: FileAST;
  readonly jsxRoots: readonly JSXRoot[];

  private getJSXRoots(): JSXRoot[] {
    const statements = this.ast.program.body;

    const jsxRoots: JSXRoot[] = [];

    for (const statement of statements) {
      if (
        statement.type === "ExportDefaultDeclaration" ||
        statement.type === "ExportNamedDeclaration"
      ) {
        const declaration = statement.declaration;
        if (declaration?.type === "FunctionDeclaration") {
          const name = declaration.id?.name;
          const body = declaration.body;
          if (body.type === "BlockStatement") {
            const bodyStatements = body.body;
            for (const bodyStatement of bodyStatements) {
              if (bodyStatement.type === "ReturnStatement") {
                const returnStatement = bodyStatement;
                const returnValue = returnStatement.argument;
                if (returnValue?.type === "JSXElement") {
                  jsxRoots.push({
                    name,
                    element: returnValue,
                  });
                }
              }
            }
          }
        }
      }
    }

    return jsxRoots;
  }

  selection = new NodeSelection();
}
