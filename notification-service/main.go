package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

// Estrutura para receber o payload da venda enviada pelo Node.js
type VendaNotificationRequest struct {
	VendaID        int     `json:"vendaId"`
	ProdutoTitulo  string  `json:"produtoTitulo"`
	ValorTotal     float64 `json:"valorTotal"`
	ValorVendedor  float64 `json:"valorVendedor"`
	TaxaPlataforma float64 `json:"taxaPlataforma"`
	EmailVendedor  string  `json:"emailVendedor"`
}

// Resposta JSON enviada pelo serviço em Go
type Response struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func enviarEmailHandler(w http.ResponseWriter, r *http.Request) {
	// Permitir apenas método POST
	if r.Method != http.MethodPost {
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		return
	}

	var notif VendaNotificationRequest
	err := json.NewDecoder(r.Body).Decode(&notif)
	if err != nil {
		http.Error(w, "Payload inválido", http.StatusBadRequest)
		return
	}

	// Processamento assíncrono usando Goroutine (não trava a resposta do HTTP)
	go processarEnvioEmail(notif)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(Response{
		Status:  "success",
		Message: "Notificação de e-mail enfileirada para envio",
	})
}

func processarEnvioEmail(n VendaNotificationRequest) {
	log.Printf("📧 [Go Worker] Iniciando envio de e-mail para: %s...", n.EmailVendedor)

	// Simula delay de envio de servidor SMTP (ex: SendGrid / SES)
	time.Sleep(2 * time.Second)

	fmt.Println("\n=======================================================")
	fmt.Println("📬 [E-MAIL DISPARADO COM SUCESSO - THRIFT STORE]")
	fmt.Printf("Para: %s\n", n.EmailVendedor)
	fmt.Printf("Assunto: 🎉 Parabéns! Seu desapego '%s' foi vendido!\n", n.ProdutoTitulo)
	fmt.Println("-------------------------------------------------------")
	fmt.Printf("ID da Venda: #%d\n", n.VendaID)
	fmt.Printf("Valor de Venda: R$ %.2f\n", n.ValorTotal)
	fmt.Printf("Taxa Plataforma (3%%): R$ %.2f\n", n.TaxaPlataforma)
	fmt.Printf("Seu Repasse (97%%): R$ %.2f\n", n.ValorVendedor)
	fmt.Println("Status Pix: O valor será creditado na sua chave cadastrada em até 24h.")
	fmt.Println("=======================================================\n")
}

func main() {
	http.HandleFunc("/api/vendas/notificar", enviarEmailHandler)

	port := ":5001"
	log.Printf("⚡ [Go] Microsserviço de Notificação rodando na porta %s", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatalf("Erro ao iniciar o servidor Go: %v", err)
	}
}
